## Description

Manage your stores and books.

User Types:
- User
- Store Manager
- Admin


User
- Ability to view all bookstores.
- Can view the books available in each store and query which books are available in
which bookstores.

Store Manager
- Can add or remove a specific quantity of a book to/from a store (from the Book table).

Admin

- Can create a new bookstore.
- Can add a new book.
- Can add or remove a specific quantity of a particular book to/from a specific
bookstore.
- Adding new users and roles can only be done by the Admin.

## Requirements

- Nodejs
- Pnpm
- Docker

## Install Dependencies

```bash
$ pnpm i
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e
```

## Start

```bash
# shutdown docker instance if exist
$ pnpm docker:compose:down

# launch docker compose
$ pnpm docker:compose:up

# start project
$ pnpm start
```
