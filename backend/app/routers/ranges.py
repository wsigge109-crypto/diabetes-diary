from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..constants import DEFAULT_RANGES
from ..database import get_db
from ..models import TargetRange, User
from ..schemas import RangesIn, RangesOut
from ..security import get_current_user

router = APIRouter(prefix="/api/ranges", tags=["ranges"])


def user_ranges(db: Session, user: User) -> dict[str, dict]:
    result = {ctx: dict(r) for ctx, r in DEFAULT_RANGES.items()}
    for r in db.scalars(select(TargetRange).where(TargetRange.user_id == user.id)):
        if r.context in result:
            result[r.context].update(min=r.min, max=r.max)
    return result


def check_range(value: float, rng: dict | None) -> bool | None:
    if not rng:
        return None
    ok_min = rng["min"] is None or value >= rng["min"]
    ok_max = rng["max"] is None or value <= rng["max"]
    return ok_min and ok_max


@router.get("", response_model=RangesOut)
def get_ranges(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return user_ranges(db, user)


@router.put("", response_model=RangesOut)
def save_ranges(data: RangesIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = {r.context: r for r in db.scalars(select(TargetRange).where(TargetRange.user_id == user.id))}
    for ctx, rng in data.items():
        row = existing.get(ctx) or TargetRange(user_id=user.id, context=ctx)
        row.min, row.max = rng.min, rng.max
        db.add(row)
    db.commit()
    return user_ranges(db, user)
