import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TokensResponseDto } from '../src/auth/dto/tokens.response.dto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { SignInDto } from '../src/auth/dto/sign-in.dto';
import { CreateUserResponseDto } from '../src/users/dto/create-user.response.dto';
import { CreateBookDto } from '../src/books/dto/create-book.dto';
import { BookResponseDto } from '../src/books/dto/book.response.dto';
import { CreateStoreDto } from '../src/stores/dto/create-store.dto';
import { CreateStoreResponseDto } from '../src/stores/dto/create-store.response.dto';
import { StoresResponseDto } from '../src/stores/dto/stores.response.dto';
import { BooksResponseDto } from '../src/books/dto/books.response.dto';
import { AvailableBooksResponseDto } from '../src/stores/dto/available-books.response.dto';
import { BookStoreResponseDto } from '../src/stores/dto/book-store.response.dto';
import { StoreResponseDto } from '../src/stores/dto/store.response.dto';
import { IncDecBookQtyDto } from '../src/stores/dto/inc-dec-book-qty.dto';

export class Utils {
  private readonly app: INestApplication;
  private accessToken: string;
  lastCreatedUser: CreateUserResponseDto;
  lastCreatedBook: BookResponseDto;
  lastCreatedStore: StoreResponseDto;

  constructor(app: INestApplication) {
    this.app = app;
  }

  async signIn(signInDto: SignInDto): Promise<TokensResponseDto> {
    const result = await request(this.app.getHttpServer())
      .post('/auth/sign-in')
      .send(signInDto)
      .expect(HttpStatus.OK);

    const body: TokensResponseDto = result.body;

    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();

    this.accessToken = body.accessToken;

    return result.body;
  }

  async createUser(createUserDto: CreateUserDto) {
    const result = await request(this.app.getHttpServer())
      .post('/users')
      .set('authorization', `Bearer ${this.accessToken}`)
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    const body: CreateUserResponseDto = result.body;

    expect(body.type).toBe(createUserDto.type);
    expect(body.username).toBe(createUserDto.username);

    this.lastCreatedUser = body;

    return body;
  }

  async createBook(createBookDto: CreateBookDto) {
    const result = await request(this.app.getHttpServer())
      .post('/books')
      .set('authorization', `Bearer ${this.accessToken}`)
      .send(createBookDto)
      .expect(HttpStatus.CREATED);

    const body: BookResponseDto = result.body;

    expect(body.id).toBeDefined();
    expect(body.isbn).toBe(createBookDto.isbn);
    expect(body.name).toBe(createBookDto.name);
    expect(body.publisher).toBe(createBookDto.publisher);

    this.lastCreatedBook = body;

    return body;
  }

  async createBookWithError(createBookDto: CreateBookDto, errorCode = 400) {
    const result = await request(this.app.getHttpServer())
      .post('/books')
      .set('authorization', `Bearer ${this.accessToken}`)
      .send(createBookDto)
      .expect(errorCode);

    return result.body;
  }

  async createStore(createStoreDto: CreateStoreDto) {
    const result = await request(this.app.getHttpServer())
      .post('/stores')
      .set('authorization', `Bearer ${this.accessToken}`)
      .send(createStoreDto)
      .expect(HttpStatus.CREATED);

    const body: CreateStoreResponseDto = result.body;

    expect(body.id).toBeDefined();
    expect(body.name).toBe(createStoreDto.name);

    this.lastCreatedStore = body;

    return body;
  }

  async listStores(skip: number, take: number) {
    const result = await request(this.app.getHttpServer())
      .get('/stores')
      .set('authorization', `Bearer ${this.accessToken}`)
      .query({ skip, take })
      .expect(HttpStatus.OK);

    const body: StoresResponseDto = result.body;

    expect(body.stores.length).toBeGreaterThanOrEqual(0);
    expect(body.meta).toBeDefined();

    return body;
  }

  async listBooks(skip: number, take: number) {
    const result = await request(this.app.getHttpServer())
      .get('/books')
      .set('authorization', `Bearer ${this.accessToken}`)
      .query({ skip, take })
      .expect(HttpStatus.OK);

    const body: BooksResponseDto = result.body;

    expect(body.books).toBeDefined();
    expect(body.meta).toBeDefined();

    return body;
  }

  async addBookQtyToStore(storeId: number, incDecBookQtyDto: IncDecBookQtyDto) {
    const result = await request(this.app.getHttpServer())
      .post(`/stores/${storeId}/increase-quantity`)
      .set('authorization', `Bearer ${this.accessToken}`)
      .send(incDecBookQtyDto)
      .expect(HttpStatus.OK);

    const body: BookStoreResponseDto = result.body;

    expect(body).toBeDefined();
    expect(body.id).toBeDefined();
    expect(body.qty).toBeDefined();
    expect(body.qty).toBeGreaterThanOrEqual(incDecBookQtyDto.qty);

    return body;
  }

  async listAvailableBooks(skip: number, take: number) {
    const result = await request(this.app.getHttpServer())
      .get('/books/available')
      .set('authorization', `Bearer ${this.accessToken}`)
      .query({ skip, take })
      .expect(HttpStatus.OK);

    const body: AvailableBooksResponseDto = result.body;

    expect(body.books).toBeDefined();
    expect(body.meta).toBeDefined();

    return body;
  }
}
