import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { Query } from 'express-serve-static-core';
import { title } from 'process';
import { User } from '../auth/schemas/user.schema';


@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: Query): Promise<Book[]> {
    // console.log("hhhhhhhhhhhhhhhh", query)
    const resPerPage = Number(query.resPerPage) || 2;
    const pageNum = Number(query.page) || 1;
    const skip = resPerPage * (pageNum - 1);

    const keyword = query.keyword ? {
      title : {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}

    const book = await this.bookModel.find({...keyword}).skip(skip).limit(resPerPage);
    return book;
  }

  async create(book: CreateBookDto, user: User): Promise<Book> {

    const data = Object.assign(book, {user: user._id});

    const res = await this.bookModel.create(book);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  async updateById(id: string, book: Book): Promise<Book> {

    const isValidId = mongoose.isValidObjectId(id);
    if(!isValidId){
      throw new BadRequestException('Please provide correct book id')
    }

    const res = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });

    if (!res) {
      throw new NotFoundException('Book not found');
    }

    return res;
  }

  async deleteById(id: string): Promise<Book> {
    const res = await this.bookModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Book not found');
    }
    return res;
  }
}
