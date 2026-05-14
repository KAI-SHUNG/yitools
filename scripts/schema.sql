-- 邀请码表
create table invite_codes (
  code text primary key,
  used boolean default false
);
-- 替换为你自己的邀请码
insert into invite_codes (code) values ('yijing2026');

-- 起卦记录表
create table divinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  question text not null,                          -- 起卦事项（必填）
  wen_number smallint not null,                    -- 本卦文王序号
  changed_wen_number smallint,                     -- 变卦序号（无变卦为null）
  changing_positions smallint[] not null default '{}', -- 动爻位置
  created_at timestamptz default now()
);

alter table divinations enable row level security;
create policy "users manage own divinations" on divinations
  for all using (auth.uid() = user_id);
