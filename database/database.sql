create database exclusiv_cars_db;

create table users (
    id serial not null primary key,
    fullname varchar(40),
    username character(15) not null,
    password character varying not null,
    created_at timestamp not null default current_timestamp,
    isadmin integer not null default 0
);
ALTER TABLE users
  OWNER TO postgres;
GRANT ALL ON TABLE users TO postgres;
GRANT ALL ON TABLE users TO app_adm;

create table work_orders (
    id serial not null primary key,
    clientid integer,
    estado integer,
    telefono_contacto character varying,
    vehiculo character varying,
    vinnro character varying,
    color character varying,
    chapa character varying,
    recorrido character varying,
    combustible character varying,
    description text,
    costo integer,
    mecanico_a_cargo character varying,
    user_recibio integer,
    entregado timestamp,
    garantia text,
    created_at timestamp not null default now(),

    constraint fk_user_wo foreign key (user_recibio) references users(id)
)
ALTER TABLE work_orders
  OWNER TO postgres;
GRANT ALL ON TABLE work_orders TO postgres;
GRANT ALL ON TABLE work_orders TO app_adm;