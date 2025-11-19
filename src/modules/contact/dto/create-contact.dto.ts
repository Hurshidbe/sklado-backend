import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MessageDto {
    @ApiProperty({description :  `xabar matni`, example : 'salomaat, yaxshimisiiz ? '})
    @IsString()
    @IsNotEmpty()
    message : string
}