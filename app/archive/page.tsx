'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Archive, 
  FileSpreadsheet, 
  Gavel,
  RotateCcw,
  Eye,
  Download,
  X,
  Calendar,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { archiveItems, ArchiveItem } from '@/lib/data';
import { NoSearchResultsState, ArchivedEntityState } from '@/components/ui/states';

type ArchiveTab = 'scenarios' | 'exports' | 'decisions';

export default function ArchivePage() {
  const [activeTab, setActiveTab] = useState<ArchiveTab>('scenarios');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  const filteredItems = archiveItems.filter(item => {
    const matchesTab = 
      (activeTab === 'scenarios' && item.type === 'scenario') ||
      (activeTab === 'exports' && item.type === 'export') ||
      (activeTab === 'decisions' && item.type === 'decision');
    
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getTypeIcon = (type: ArchiveItem['type']) => {
    switch (type) {
      case 'scenario': return Archive;
      case 'export': return FileSpreadsheet;
      case 'decision': return Gavel;
    }
  };

  const getTypeLabel = (type: ArchiveItem['type']) => {
    switch (type) {
      case 'scenario': return 'Сценарий';
      case 'export': return 'Экспорт';
      case 'decision': return 'Решение';
    }
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Архив</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Архивные сценарии, экспорты и снимки решений
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ArchiveTab)}>
              <TabsList>
                <TabsTrigger value="scenarios" className="gap-2">
                  <Archive className="h-4 w-4" />
                  Сценарии
                </TabsTrigger>
                <TabsTrigger value="exports" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Экспорты
                </TabsTrigger>
                <TabsTrigger value="decisions" className="gap-2">
                  <Gavel className="h-4 w-4" />
                  Снимки решений
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search and filters */}
          <div className="px-6 py-3 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск в архиве..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Фильтры
            </Button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredItems.length === 0 ? (
              <NoSearchResultsState
                title="Ничего не найдено"
                description={search ? 'Попробуйте изменить параметры поиска' : 'В этом разделе пока нет архивных элементов'}
                action={search ? { label: 'Сбросить поиск', onClick: () => setSearch('') } : undefined}
              />
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => {
                  const Icon = getTypeIcon(item.type);
                  const isSelected = selectedItem?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer',
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent bg-card hover:border-border'
                      )}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.archivedAt).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {item.archivedBy}
                          </div>
                        </div>
                        {item.size && (
                          <div className="text-xs text-muted-foreground w-16 text-right">
                            {item.size}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Preview panel */}
        {selectedItem && (
          <div className="w-80 border-l border-border bg-secondary/30 flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-foreground">Просмотр</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setSelectedItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Item icon and name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  {(() => {
                    const Icon = getTypeIcon(selectedItem.type);
                    return <Icon className="h-6 w-6 text-muted-foreground" />;
                  })()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-foreground truncate">{selectedItem.name}</h4>
                  <span className="text-xs text-muted-foreground">{getTypeLabel(selectedItem.type)}</span>
                </div>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedItem.description}
                </p>
              )}

              {/* Archived state notice */}
              <ArchivedEntityState 
                className="mb-4"
                title="Архивный элемент"
                description="Этот элемент находится в архиве"
              />

              {/* Metadata */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Архивирован: {new Date(selectedItem.archivedAt).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{selectedItem.archivedBy}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Создан: {new Date(selectedItem.originalCreatedAt).toLocaleDateString('ru-RU')}</span>
                </div>
                {selectedItem.size && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Размер: {selectedItem.size}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Eye className="h-4 w-4" />
                Открыть
              </Button>
              {selectedItem.canRestore && (
                <Button variant="outline" className="w-full justify-start gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Восстановить
                </Button>
              )}
              {selectedItem.type === 'export' && (
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Экспортировать снова
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
