export const Footer = () => {
  return(
    <footer className="bg-gray-800 text-white p-4 mt-8 relative">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Cooking social Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
