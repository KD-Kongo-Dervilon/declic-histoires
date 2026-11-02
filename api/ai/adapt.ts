import {execute} from '../../server/cloudflare';
export default function handler(request:Request){return execute(request,'adapt')}
