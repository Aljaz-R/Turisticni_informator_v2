export function basicAuth(user=process.env.ADMIN_USER, pass=process.env.ADMIN_PASS){
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  return (req:any,res:any,next:any)=>{
    if (req.headers.authorization === expected) return next();
    res.setHeader("WWW-Authenticate","Basic realm=\"admin\"");
    return res.status(401).json({error:"unauthorized"});
  };
}
