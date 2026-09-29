import db from "../config/db.js";
export const createUser = async(full_name,email,password,profile_image,is_active,created_at,updated_at)=>{
    const sql=`INSERT INTO users (full_name,email,password,profile_image,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`;
    const [result]=await db.execute(sql,[full_name,email,password,profile_image,is_active,created_at,updated_at]);
return result;

}

export const findUserByEmail = async (email) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [email]);

  return rows[0];
};


