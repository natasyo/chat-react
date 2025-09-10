import * as React from 'react';
import Header from '../../components/Header.tsx';
import Footer from '../../components/Footer.tsx';

type Props = {
  children: React.ReactNode;
};
export const Layout = (props: Props) => {
  return (
    <div>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};
