import {Field, InputType} from "@nestjs/graphql";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";


@InputType()
export class AuthSignInInput {

    @IsNotEmpty()
    @IsEmail()
    @Field(() => String)
    email: string

    @IsNotEmpty()
    @IsString()
    @Field(() => String)
    password: string


}