import datetime as dt

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Entry, User
from ..schemas import EntryIn, EntryOut, StatsOut
from ..security import get_current_user
from .ranges import check_range, user_ranges

router = APIRouter(prefix="/api", tags=["entries"])


@router.get("/entries", response_model=list[EntryOut])
def list_entries(
    days: int | None = Query(default=None, ge=1, le=3650, description="Только записи за последние N дней"),
    limit: int = Query(default=500, ge=1, le=5000),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = select(Entry).where(Entry.user_id == user.id)
    if days is not None:
        q = q.where(Entry.datetime >= dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days))
    return db.scalars(q.order_by(Entry.datetime.desc(), Entry.id.desc()).limit(limit)).all()


@router.post("/entries", response_model=EntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(data: EntryIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = Entry(user_id=user.id, glucose=data.glucose, context=data.context)
    if data.datetime is not None:
        entry.datetime = data.datetime
    db.add(entry)
    db.commit()
    return entry


@router.delete("/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.get(Entry, entry_id)
    if entry is None or entry.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Запись не найдена")
    db.delete(entry)
    db.commit()


@router.get("/stats", response_model=StatsOut)
def stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    latest = db.scalar(
        select(Entry).where(Entry.user_id == user.id).order_by(Entry.datetime.desc(), Entry.id.desc()).limit(1)
    )
    since = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=7)
    week = db.scalars(select(Entry).where(Entry.user_id == user.id, Entry.datetime >= since)).all()
    ranges = user_ranges(db, user)

    avg = round(sum(e.glucose for e in week) / len(week), 1) if week else None
    rated = [r for r in (check_range(e.glucose, ranges.get(e.context)) for e in week) if r is not None]
    in_range = round(100 * sum(rated) / len(rated)) if rated else None
    return StatsOut(
        current=latest.glucose if latest else None,
        week_avg=avg,
        in_range_percent=in_range,
        week_count=len(week),
    )
