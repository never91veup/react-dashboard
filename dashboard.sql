--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2022-11-22 16:36:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 16603)
-- Name: baskets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.baskets (
    id integer NOT NULL,
    sum integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer
);


ALTER TABLE public.baskets OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16602)
-- Name: baskets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.baskets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.baskets_id_seq OWNER TO postgres;

--
-- TOC entry 3327 (class 0 OID 0)
-- Dependencies: 211
-- Name: baskets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.baskets_id_seq OWNED BY public.baskets.id;


--
-- TOC entry 210 (class 1259 OID 16591)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255),
    password character varying(255),
    role character varying(255) DEFAULT 'USER'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16590)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3328 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3171 (class 2604 OID 16606)
-- Name: baskets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baskets ALTER COLUMN id SET DEFAULT nextval('public.baskets_id_seq'::regclass);


--
-- TOC entry 3169 (class 2604 OID 16594)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3321 (class 0 OID 16603)
-- Dependencies: 212
-- Data for Name: baskets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baskets (id, sum, "createdAt", "updatedAt", "userId") FROM stdin;
3	93434	2022-11-22 00:07:13.787+03	2022-11-22 00:07:13.787+03	3
7	7281	2022-11-22 00:16:14.254+03	2022-11-22 00:16:14.254+03	7
8	68025	2022-11-22 00:33:58.016+03	2022-11-22 00:33:58.016+03	8
10	54842	2022-11-22 00:40:54.752+03	2022-11-22 00:40:54.752+03	10
11	68183	2022-11-22 10:57:40.603+03	2022-11-22 10:57:40.603+03	11
\.


--
-- TOC entry 3319 (class 0 OID 16591)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role, "createdAt", "updatedAt") FROM stdin;
3	random8028@mail.ru	$2b$05$uYCRpUmR.jwtpg.4xx.G5uKNDNuHLm/3i8OwZYxv8as07id.qSriC	USER	2022-11-22 00:07:13.784+03	2022-11-22 00:07:13.784+03
7	random5698@mail.ru	$2b$05$Nks/..wTvq6Q4ro1g3NCDuWn6/jsY3aySYLYYjQAmOXIIkI9gUtDO	USER	2022-11-22 00:16:14.245+03	2022-11-22 00:16:14.245+03
8	random7474@mail.ru	$2b$05$L4zZ63mLxYZ.Q7E9By968.ecfp2qCJAVnf/Q5FNRtdYQyMwe9857a	USER	2022-11-22 00:33:58.008+03	2022-11-22 00:33:58.008+03
10	random2903@mail.ru	$2b$05$a6slncsm65mMD9Tff08fleNqJSxDfd73.RCM0W3ysPQ.A5DUNjwuW	USER	2022-11-22 00:40:54.749+03	2022-11-22 00:40:54.749+03
11	random4645@mail.ru	$2b$05$iCXimN8AOoYkv7MuyKt/7uE0nATw6NgwT5cqUcNQC6/zPHhGpDmom	USER	2022-11-22 10:57:40.599+03	2022-11-22 10:57:40.599+03
\.


--
-- TOC entry 3329 (class 0 OID 0)
-- Dependencies: 211
-- Name: baskets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.baskets_id_seq', 11, true);


--
-- TOC entry 3330 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- TOC entry 3177 (class 2606 OID 16608)
-- Name: baskets baskets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baskets
    ADD CONSTRAINT baskets_pkey PRIMARY KEY (id);


--
-- TOC entry 3173 (class 2606 OID 16601)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3175 (class 2606 OID 16599)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3178 (class 2606 OID 16609)
-- Name: baskets baskets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baskets
    ADD CONSTRAINT "baskets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2022-11-22 16:36:07

--
-- PostgreSQL database dump complete
--

