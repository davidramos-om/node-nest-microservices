import * as bcrypt from 'bcrypt';

export const comparePasswords = async (clearPassword, encryptedPassword) =>
{
    return await bcrypt.compare(clearPassword, encryptedPassword);
};

export const generatePassword = async (clearText: string, saltRounds: number = 10) =>
{
    const result = await bcrypt.hash(clearText, saltRounds);
    return result;
}