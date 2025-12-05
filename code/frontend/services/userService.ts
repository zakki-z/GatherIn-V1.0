import { apiFetch } from './api';
import { User } from '@/types/user';

const USER_ENDPOINT = '/users';

export const userService = {
    // GET /users - backend/src/main/java/com/example/backend/user/UserController.java
    findConnectedUsers: async (): Promise<User[]> => {
        return apiFetch<User[]>(USER_ENDPOINT, {
            // Set cache to 'no-store' to ensure fresh list of online users on RSC load.
            cache: 'no-store'
        });
    },
};
