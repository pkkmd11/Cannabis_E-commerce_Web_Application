export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm" data-testid="text-copyright">
            © {currentYear} DeeDoZeeYo. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
