create database exclusiv_cars_db;

create table users (
    id serial not null primary key,
    name varchar(40)
);

insert into users (name)
    values ('Administrador');

alter table users add column username character(15);
update users set username = 'admin' where id = 1;
alter table users alter column username set not null;