--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3 (Ubuntu 10.3-1)
-- Dumped by pg_dump version 10.3 (Ubuntu 10.3-1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: doctypes; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.doctypes AS ENUM (
    'page'
);


ALTER TYPE public.doctypes OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.config (
    id bigint NOT NULL,
    date_modify timestamp with time zone,
    type public.doctypes,
    content json
);


ALTER TABLE public.config OWNER TO postgres;

--
-- Name: config_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.config_id_seq OWNER TO postgres;

--
-- Name: config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.config_id_seq OWNED BY public.config.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id bigint NOT NULL,
    date_create timestamp with time zone,
    date_modify timestamp with time zone,
    user_id integer,
    type public.doctypes,
    content json,
    url text,
    deleted boolean,
    name text,
    published boolean
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.documents_id_seq OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: emptyauths; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emptyauths (
    id bigint NOT NULL,
    date timestamp with time zone,
    ip text
);


ALTER TABLE public.emptyauths OWNER TO postgres;

--
-- Name: emptyauths_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emptyauths_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.emptyauths_id_seq OWNER TO postgres;

--
-- Name: emptyauths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emptyauths_id_seq OWNED BY public.emptyauths.id;


--
-- Name: logins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logins (
    id bigint NOT NULL,
    date timestamp with time zone,
    user_id bigint,
    login text,
    ip text,
    active boolean
);


ALTER TABLE public.logins OWNER TO postgres;

--
-- Name: logins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.logins_id_seq OWNER TO postgres;

--
-- Name: logins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logins_id_seq OWNED BY public.logins.id;


--
-- Name: options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.options (
    id bigint NOT NULL,
    date_modify timestamp with time zone,
    type public.doctypes,
    content json,
    user_id integer
);


ALTER TABLE public.options OWNER TO postgres;

--
-- Name: options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.options_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.options_id_seq OWNER TO postgres;

--
-- Name: options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.options_id_seq OWNED BY public.options.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name text,
    password text,
    email text,
    counter integer,
    limiter integer,
    superuser boolean,
    date_create timestamp with time zone,
    date_modify timestamp with time zone,
    activatehash text,
    active boolean,
    demo boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: config id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.config ALTER COLUMN id SET DEFAULT nextval('public.config_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: emptyauths id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emptyauths ALTER COLUMN id SET DEFAULT nextval('public.emptyauths_id_seq'::regclass);


--
-- Name: logins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logins ALTER COLUMN id SET DEFAULT nextval('public.logins_id_seq'::regclass);


--
-- Name: options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options ALTER COLUMN id SET DEFAULT nextval('public.options_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: config config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: emptyauths emptyauths_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emptyauths
    ADD CONSTRAINT emptyauths_pkey PRIMARY KEY (id);


--
-- Name: logins logins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logins
    ADD CONSTRAINT logins_pkey PRIMARY KEY (id);


--
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: documents_deleted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documents_deleted ON public.documents USING btree (deleted);


--
-- Name: documents_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documents_user_id ON public.documents USING btree (user_id);


--
-- Name: documents documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

