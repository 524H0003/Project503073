import Layout from "@/components/layout";

interface Note {
  id: number;
  title: string;
  content: string;
  is_offline?: boolean;
}

export default function Index(note: Note) {
  return Layout(<></>);
}
