create table users (
    id serial not null primary key,
    fullname character varying ,
    username character varying not null,
    password character varying not null,
    isadmin integer not null default 0,
    active integer not null default 1,
    created_by integer,
    created_at timestamp not null default current_timestamp
);
ALTER TABLE users
    OWNER TO postgres;

insert into users(fullname, username, password, isadmin, active, created_by)
values ('Administrador', 'admin', '$2a$10$Z0.J2AZa44av6sVM20qXu.JNscwf6IYBqwH/nMRL84b1jBtZlzHDu', 1, 1, 1); -- la contraseña es 1 al 5

/*creacion de la tabla de roles*/
CREATE TABLE public.roles
(
    id_rol serial NOT NULL,
    name character varying,
    CONSTRAINT "PK_ROLE" PRIMARY KEY (id_rol)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.roles
    OWNER to postgres;
    
/*creacion de la tabla de permisos*/
CREATE TABLE permissions
(
   id serial, 
   resources character varying(255),
   operation character varying(255),
   name character varying(255), 
   CONSTRAINT "PK_PERMISSION" PRIMARY KEY (id)
) 
WITH (
  OIDS = FALSE
)
;
ALTER TABLE permissions
    OWNER TO postgres;

GRANT ALL ON TABLE permissions TO postgres;
GRANT ALL ON sequence permissions_id_seq TO postgres;

-- desde aqui  se debe ejecutar para los ultimos cambios de rol, rol_permiso y users
ALTER TABLE public.roles
    RENAME id_rol TO id;

/*Creacion de la tabla Rol_permiso*/
CREATE TABLE public.rol_permiso
(
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT "FK_ROL" FOREIGN KEY (id_rol)
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_PERMISO" FOREIGN KEY (id_permiso)
        REFERENCES public.permissions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public.rol_permiso
    OWNER to postgres;

alter table users add id_rol integer;
alter table users add constraint fk_rol foreign key (id_rol) references roles(id);

-- Table: public.tasks

-- DROP TABLE public.tasks;

CREATE TABLE public.tasks
(
    id serial NOT NULL,
    status character varying NOT NULL,
    description character varying,
    tarea_padre_id integer,
    created_at timestamp not null default current_timestamp,
    created_by integer,
    CONSTRAINT tasks_pkey PRIMARY KEY (id)
);

ALTER TABLE public.tasks
    OWNER to postgres;
GRANT ALL ON sequence tasks_id_seq TO postgres;


-- Table: public.projects

-- DROP TABLE public.projects;

CREATE TABLE public.projects
(
	id serial NOT NULL,
	name character varying NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    created_by INTEGER,
	CONSTRAINT project_pkey PRIMARY KEY (id)
);

ALTER TABLE public.projects
    OWNER to postgres;
GRANT ALL ON sequence projects_id_seq TO postgres;