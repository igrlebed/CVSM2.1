'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const MOCK_REPORTS = [
  { id: '1', name: 'Сводный отчёт по сети', format: 'xlsx', status: 'ready', date: '2026-04-10 14:30', size: '2.4 МБ' },
  { id: '2', name: 'Сравнение сценариев', format: 'pdf', status: 'ready', date: '2026-04-09 11:00', size: '5.1 МБ' },
  { id: '3', name: 'Инвестиционный план до 2050', format: 'docx', status: 'in-progress', date: '2026-04-11 10:00', size: '—' },
  { id: '4', name: 'ПредТЭО МСК-Казань', format: 'xlsx', status: 'queued', date: '2026-04-11 10:05', size: '—' },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'ready': return <Badge className="bg-emerald-500 text-[10px]"><CheckCircle className="h-3 w-3 mr-1" /> Готов</Badge>;
    case 'in-progress': return <Badge variant="secondary" className="text-[10px]"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Формируется</Badge>;
    case 'queued': return <Badge variant="outline" className="text-[10px]"><Clock className="h-3 w-3 mr-1" /> В очереди</Badge>;
    case 'failed': return <Badge variant="destructive" className="text-[10px]"><XCircle className="h-3 w-3 mr-1" /> Ошибка</Badge>;
  }
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('summary');
  const [format, setFormat] = useState('xlsx');

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="px-6 py-4 border-b border-border/40 bg-card">
          <h1 className="text-xl font-semibold text-foreground">Отчёты и выгрузки</h1>
          <p className="text-sm text-muted-foreground">Формирование и выгрузка отчётов в xlsx, docx, pdf</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Create report */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Сформировать отчёт</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Тип отчёта</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[250px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Сводный отчёт</SelectItem>
                      <SelectItem value="comparison">Сравнение сценариев</SelectItem>
                      <SelectItem value="investment">Инвестиционный план</SelectItem>
                      <SelectItem value="feasibility">ПредТЭО</SelectItem>
                      <SelectItem value="effectiveness">Эффективность</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Формат</label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="docx">Word (.docx)</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="gap-2"><Download className="h-4 w-4" /> Сформировать</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent reports */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Последние отчёты</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Формат</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Размер</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_REPORTS.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-sm">{r.name}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px] uppercase">{r.format}</Badge></TableCell>
                      <TableCell>{getStatusBadge(r.status)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.size}</TableCell>
                      <TableCell>
                        {r.status === 'ready' && (
                          <Button variant="ghost" size="sm" className="h-7 gap-1">
                            <Download className="h-3.5 w-3.5" /> Скачать
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="px-6 py-2 border-t border-border/40 bg-card/50">
          <p className="text-[10px] text-muted-foreground">Цифровая модель ВСМ • Версия 0.1.0 • ОАО «РЖД»</p>
        </div>
      </div>
    </AppShell>
  );
}
