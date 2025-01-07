import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Utils } from './utils';
import { AuthModule } from '../src/auth/auth.module';
import { UserType } from '../src/common/enums/user-type.enum';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ status: 'ok' });
  });

  describe('check admin abilities', () => {
    let utils: Utils;
    beforeAll(async () => {
      app = moduleFixture.createNestApplication();
      await app.init();
      utils = new Utils(app);
      await utils.signIn({
        username: 'admin',
        password: 'admin',
      });
    });

    it('should create user successfully', async () => {
      console.log('should create user successfully');
      await utils.createUser({
        username: faker.internet.username(),
        password: faker.internet.password(),
        type: UserType.USER,
      });
    });

    it('should create book successfully', async () => {
      await utils.createBook({
        name: faker.book.title(),
        publisher: faker.book.publisher(),
        isbn: faker.commerce.isbn({ separator: '' }),
      });
    });

    it('should create store successfully', async () => {
      await utils.createStore({
        name: faker.company.name(),
      });
    });

    it('should list stores successfully', async () => {
      const result = await utils.listStores(0, 1);
      expect(result.stores.length).toBeGreaterThanOrEqual(1);
      expect(result.stores[0].id).toBeDefined();
      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    it('should list books successfully', async () => {
      const result = await utils.listBooks(0, 1);
      expect(result.books.length).toBeGreaterThanOrEqual(1);
      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });

    it('should add book qty to store successfully', async () => {
      await utils.addBookQtyToStore(utils.lastCreatedStore.id, {
        bookId: utils.lastCreatedBook.id,
        qty: 1,
      });

      await utils.addBookQtyToStore(utils.lastCreatedStore.id, {
        bookId: utils.lastCreatedBook.id,
        qty: 1,
      });
    });

    it('should list available books successfully', async () => {
      const result = await utils.listAvailableBooks(0, 1);
      expect(result.books.length).toBeGreaterThanOrEqual(1);
      expect(result.books[0].totalQty).toBeGreaterThanOrEqual(0);
      expect(result.meta.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe('check store manager abilities', () => {
    let utils: Utils;
    beforeAll(async () => {
      app = moduleFixture.createNestApplication();
      await app.init();
      utils = new Utils(app);
      await utils.signIn({
        username: 'store_manager',
        password: 'store_manager',
      });
    });

    it('should throw error create a book', async () => {
      await utils.createBookWithError(
        {
          name: faker.book.title(),
          publisher: faker.book.publisher(),
          isbn: faker.commerce.isbn({ separator: '' }),
        },
        403,
      );
    });
  });

  describe('check test user abilities', () => {
    let utils: Utils;
    beforeAll(async () => {
      app = moduleFixture.createNestApplication();
      await app.init();
      utils = new Utils(app);
      await utils.signIn({
        username: 'test_user',
        password: 'test_user',
      });
    });

    it('should throw error create a book', async () => {
      await utils.createBookWithError(
        {
          name: faker.book.title(),
          publisher: faker.book.publisher(),
          isbn: faker.commerce.isbn({ separator: '' }),
        },
        403,
      );
    });
  });
});
