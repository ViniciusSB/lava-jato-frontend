import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUtil } from '../util/auth-util';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

    return AuthUtil.verificarToken() ? true : router.navigate(['/login']);
};
