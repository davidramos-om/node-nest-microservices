import { Observable } from 'rxjs';
import { LoginUserDto } from '../app.controller';

//Important : must start with lowercase
export interface AuthService
{
  findUserByEmail(data: { email: string; }): Observable<any>;
  login(data: LoginUserDto): Observable<any>;
  isLoggedIn(data: { jwt: string }): Observable<any>
  whoAmI(data: { jwt: string }): Observable<any>
}
