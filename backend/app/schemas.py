import datetime as dt

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from .constants import Context, RangeContext


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Имя не может быть пустым")
        return v


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ForgotIn(BaseModel):
    email: EmailStr


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class EntryIn(BaseModel):
    glucose: float = Field(ge=1, le=35)
    context: Context
    datetime: dt.datetime | None = None

    @field_validator("glucose")
    @classmethod
    def round_glucose(cls, v: float) -> float:
        return round(v, 1)


class EntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    datetime: dt.datetime
    glucose: float
    context: Context


class RangeIn(BaseModel):
    min: float | None = Field(default=None, ge=0, le=50)
    max: float | None = Field(default=None, ge=0, le=50)

    @model_validator(mode="after")
    def check_bounds(self):
        if self.min is None and self.max is None:
            raise ValueError("Укажите хотя бы одну границу")
        if self.min is not None and self.max is not None and self.min >= self.max:
            raise ValueError("Нижняя граница должна быть меньше верхней")
        return self


class RangeOut(RangeIn):
    hint: str


RangesIn = dict[RangeContext, RangeIn]
RangesOut = dict[RangeContext, RangeOut]


class StatsOut(BaseModel):
    current: float | None
    week_avg: float | None
    in_range_percent: int | None
    week_count: int
