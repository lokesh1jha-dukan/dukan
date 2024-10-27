-- CreateTable
CREATE TABLE "auth_requests" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(255) NOT NULL DEFAULT 'draft',
    "date_created" TIMESTAMPTZ(6),
    "date_updated" TIMESTAMPTZ(6),
    "hashed_otp" VARCHAR(255),
    "email" VARCHAR(255),
    "action" VARCHAR(255),

    CONSTRAINT "auth_requests_pkey" PRIMARY KEY ("id")
);
