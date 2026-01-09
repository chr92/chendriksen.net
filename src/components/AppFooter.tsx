export default function AppFooter() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} chendriksen
      </div>
    </footer>
  )
}
