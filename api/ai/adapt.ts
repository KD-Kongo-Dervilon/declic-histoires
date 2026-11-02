import {execute} from '../../server/cloudflare.ts';
export default function handler(req:any,res:any){return execute(req,res,'adapt')}
