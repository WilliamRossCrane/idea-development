import Screen from './screen';
export default async function Page({params}){const {code}=await params;return <Screen code={code.toUpperCase()}/>;}
