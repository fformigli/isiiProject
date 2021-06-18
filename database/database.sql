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
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT "FK_TAREA_PADRE" FOREIGN KEY (tarea_padre_id)
            REFERENCES public.tasks (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
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

-- modificacion para tabla roles

ALTER TABLE roles ADD created_by INTEGER;
ALTER TABLE roles ADD created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

alter table tasks add constraint fk_tarea_padre foreign key (tarea_padre_id) references tasks(id);

alter table tasks add column version character varying;
alter table tasks add column priority integer NOT NULL DEFAULT 0;
alter table tasks add column observation character varying;

CREATE TABLE public.base_lines
(
    id serial not null,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default",
    CONSTRAINT base_lines_pkey PRIMARY KEY (id)
);

ALTER TABLE public.base_lines
    OWNER to postgres;

GRANT ALL ON sequence base_lines_id_seq TO postgres;

CREATE TABLE public.base_line_tasks
(
    base_line_id integer NOT NULL,
    task_id integer NOT NULL,
    CONSTRAINT base_line_tasks_id PRIMARY KEY (base_line_id, task_id),
    CONSTRAINT base_line_fk FOREIGN KEY (base_line_id)
        REFERENCES public.base_lines (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT task_fk FOREIGN KEY (base_line_id)
        REFERENCES public.tasks (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE public.base_line_tasks
    OWNER to postgres;

-- modificacion para tabla de base_lines
ALTER TABLE base_lines ADD created_by INTEGER;
ALTER TABLE base_lines ADD created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE base_lines ADD COLUMN project_id integer;
ALTER TABLE tasks ADD COLUMN project_id integer;

-- modificaciones para permisos
ALTER TABLE public.roles
    ADD COLUMN context character varying;

alter table users drop column id_rol;
delete from roles;
insert into roles (name, context)
values ( 'Administrador', 'sistema'),
       ( 'Project Manager', 'proyecto'),
       ( 'Desarrollador', 'proyecto');

-- Table: public.user_roles

-- DROP TABLE public.user_roles;

CREATE TABLE IF NOT EXISTS public.user_roles
(
    userid integer NOT NULL,
    rolid integer NOT NULL,
    contextid integer NOT NULL DEFAULT 0, -- 0 es para sistema, si es otro numero, referencia al id proyecto
    CONSTRAINT user_roles_pkey PRIMARY KEY (userid, rolid, contextid)
)

    TABLESPACE pg_default;

ALTER TABLE public.user_roles
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.project_participants
(
    projectid integer,
    userid integer,
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    crated_by integer NOT NULL,
    PRIMARY KEY (projectid, userid)
);

ALTER TABLE public.project_participants
    OWNER to postgres;

ALTER TABLE public.tasks
    ADD COLUMN assigned_to integer;