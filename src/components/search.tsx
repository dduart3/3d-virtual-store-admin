import { useSearch } from '@/contexts/SearchContext';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export function Search() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
