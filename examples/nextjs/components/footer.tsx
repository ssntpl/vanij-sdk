import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-500">Contact Us</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Shipping &amp; Returns</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">About</h3>
            <p className="mt-4 text-sm text-gray-500">
              This is an example storefront built with Next.js and the{' '}
              <a
                href="https://github.com/ssntpl/vanij-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                @vanij/storefront-sdk
              </a>
              .
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-xs text-gray-400">
            Powered by{' '}
            <a
              href="https://vanij.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-500 hover:text-gray-700"
            >
              Vanij
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
