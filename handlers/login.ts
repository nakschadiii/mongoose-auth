interface LoginPayload {
    identifier: string;
    password: string;
}

export async function login(payload: LoginPayload) {
    const { email, phone, name, password } = this.fields.user;

    if (!payload.identifier || !payload.password) {
        throw new Error("Missing credentials");
    }

    const criteria = {
        $or: [
            { [email]: payload.identifier },
            { [phone]: payload.identifier },
            { [name]: payload.identifier },
        ],
    };
    const user = await this.models.User.findOne(criteria);

    if (!user) {
        throw new Error("User not found");
    }

    const isValid = await this.crypt.compare(payload.password, user[password]);

    if (!isValid) {
        throw new Error("Invalid password");
    }

    if (!this?.options?.otp) {
        return {
            user_id: (this?.options?.jwt) ?
                await this.jwt.sign({ id: user._id.toString() }) :
                user._id.toString()
        };
    }

    const otp_code = (
        Math.floor(Math.random() * 900000) + 100000
    ).toString();
    const otpDoc = await this?.models?.OTP?.findOneAndUpdate(
        {
            [this?.fields?.otp?.user]: user._id,
        },
        {
            [this?.fields?.otp?.user]: user._id,
            [this?.fields?.otp?.code]: otp_code,
            [this?.fields?.otp?.expires]: new Date(Date.now() + 5 * 60 * 1000),
        },
        {
            upsert: true,
            returnDocument: "after",
        }
    );

    return {
        otp_token: (this?.options?.jwt) ?
            await this.jwt.sign({ id: otpDoc._id.toString() }) :
            otpDoc._id.toString(),
        otp_code,
        otp_length: otp_code.length
    };
}
