import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsString, Length } from "class-validator";


export class CreateProductDto {
  @ApiProperty({ type: 'string', example: 'gilos' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    type: 'string',
    enum: ['piece', 'liter', 'kg', 'm'],
    default: 'kg'
  })
  @IsEnum(['piece', 'liter', 'kg', 'm'])
  unit: string;

  @ApiProperty({type: 'string',example: '675c4b33ff09ecb11a41d955',description: 'Category ObjectId',})
  @IsMongoId()
  category: string;
}
