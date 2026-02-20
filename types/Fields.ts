export type Fields = {
    user: {
        name: string;
        email: string;
        phone: string;
        password: string;
    };
    otp: {
        user: string;
        code: string;
        expires: string;
    };
};
