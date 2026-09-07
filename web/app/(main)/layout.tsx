import { Header } from "@/app/components/Header";
import { FeedbackWidget } from "@/app/components/FeedbackWidget";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <FeedbackWidget />
    </>
  );
}
