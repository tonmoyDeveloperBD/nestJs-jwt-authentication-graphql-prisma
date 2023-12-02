import {Args, Mutation, Resolver} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {Endpoint} from "../../shared/enums/endpoint.enum";
import {AuthSignupInput} from "./dto/auth-signup.input";
import {AuthSignInInput} from "./dto/auth-signin.input";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}


  @Mutation(() => String,{name: Endpoint.SIGN_IN})
  signIn(@Args('authSignInInput') authSignInInput: AuthSignInInput) {
    return this.authService.signIn(authSignInInput);
  }


  @Mutation(() => String,{name: Endpoint.SIGN_UP})
  signUp(@Args('authSignupInput') authSignupInput: AuthSignupInput) {
    return this.authService.signUp(authSignupInput);
  }



}
