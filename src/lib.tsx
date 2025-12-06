import { Md5 } from 'ts-md5';

export function encodepwd(s:string,base:number,p:number):number{
    var tmp:string=Md5.hashStr(s);
    var ret:number=0;
    for(var i=0;i<tmp.length;i++){
        ret=(ret*base+tmp.codePointAt(i)!)%p;
    }
    return ret;
}
export function decode(a:Array<number>,p1:number,p2:number,p:number):string{
    var ret:string="";
    var b:Array<number>=[];
    var len:number=a.length;
    if(len<=0)return ret;
    var lst:number=0;
    for(var i:number=0;i<len;i++){
        b.push((p1*lst+p2+a[i])%p);
        lst=b[i];
    }
    if(lst!=0)return "password error";
    for(var i:number=0;i<len-1;i++){
        ret+=(String.fromCodePoint(b[i]));
    }
    return ret;
}
export function encode(s:string,p1:number,p2:number,p:number):Array<number>{
    var a:Array<number>=[];
    var len:number=s.length;
    var lst:number=0;
    for(var i:number=0;i<len;i++){
        var t:number=s.codePointAt(i)!;
        a.push(((t-p1*lst-p2)%p+p)%p);
        lst=t;
    }
    a.push(((-p1*lst-p2)%p+p)%p)
    return a;
}

// 开发环境下临时暴露到全局，便于调试
// if (typeof window !== 'undefined') {
//     (window as any).encodepwd = encodepwd;
//     (window as any).decode = decode;
//     (window as any).encode = encode;
// }