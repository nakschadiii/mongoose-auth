import type { Fields } from "../types";

export async function register(payload: { name: string, email: string, phone: string, password: string }): Promise<any> {
    const { name, email, phone, password }: Fields["user"] = (this)?.fields?.user;

    const criteria = {
        $or: [
            { [name]: payload[name] },
            { [email]: payload[email] },
            { [phone]: payload[phone] },
        ],
    };
    const existingUser = await this.models.User.findOne(criteria);

    if (existingUser) throw new Error("User already exists");
    const hashedPassword = await this.crypt.hash(payload[password]);

    try {
        const user = await this.models.User.create({
            [name]: payload[name],
            [email]: payload[email],
            [phone]: payload[phone],
            [password]: hashedPassword,
        });

        return {
            user_token: this?.options?.jwt ? await this.jwt.sign({ id: user._id.toString() }) : user._id.toString(),
        };
    } catch (error) {
        throw new Error("Failed to register user");
    }
}