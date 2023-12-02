import {Field, InputType} from "@nestjs/graphql";
import {IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword} from "class-validator";

@InputType()
export class AuthSignupInput {

    @IsNotEmpty()
    @IsEmail()
    @Field(() => String,)
    email: string;

    @IsNotEmpty()
    @IsString()
    @Field(() => String,)
    password: string;

    @IsOptional()
    @IsString()
    @Field(() => String)
    name: string;

    @Field(() => String,{nullable: true})
    refreshToken: string;

}