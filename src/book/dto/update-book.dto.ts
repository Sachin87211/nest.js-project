import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Category } from 'src/book/schemas/book.schema';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please provide correct category' })
  readonly category: Category;

  @IsEmpty({ message: 'you donnot have to send user id' })
  readonly user: User
}
