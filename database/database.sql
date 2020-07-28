create database exclusiv_cars_db;

create table users (
    id serial not null primary key,
    fullname varchar(40)
);

insert into users (fullname)
    values ('Administrador');

alter table users add column username character(15);
update users set username = 'admin' where id = 1;
alter table users alter column username set not null;

alter table users add column password character varying not null;

create table links (
    id serial not null primary key,
    title character varying not null,
    url character varying not null,
    description text,
    userid integer,
    created_at timestamp not null default current_timestamp,
    constraint fk_user foreign key (userid) references users(id)
);