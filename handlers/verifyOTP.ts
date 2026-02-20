export async function verifyOTP(payload: { token: string; code: string; }) {
    const id = (this?.options?.jwt) ?
        (await this.jwt.verify(payload.token))?.id :
        payload.token;

    if (!id) throw new Error('Invalid token')

    const otpDoc = await this.models.OTP.findById(id);
    if (!otpDoc) throw new Error("OTP not found");

    const isValid = payload.code === otpDoc.code;
    if (!isValid) throw new Error("Invalid OTP");

    await this.models.OTP.findByIdAndDelete(id);

    return {
        user_token: this?.options?.jwt ? await this.jwt.sign({ id: otpDoc.user }) : otpDoc.user,
    };
}
