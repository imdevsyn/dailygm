import { useState } from 'react';
import { Input } from '../ui/input'
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export function DataTable() {
  // Dados iniciais da tabela
  const [data] = useState([
    { id: 1, address: '0x15as...a24s', streak: 24, gms: 45},
    { id: 2, address: '0x25as...a24s', streak: 30, gms: 53 },
    { id: 3, address: '0x35as...a24s', streak: 22, gms: 15 },
    { id: 4, address: '0x45as...a24s', streak: 28, gms: 45 },
    { id: 5, address: '0x55as...a24s', streak: 26, gms: 81 },
    { id: 6, address: '0x65as...a24s', streak: 27, gms: 3 },
    { id: 7, address: '0x75as...a24s', streak: 29, gms: 22 },
    { id: 8, address: '0x85as...a24s', streak: 25, gms: 4 },
    { id: 9, address: '0x85as...a24s', streak: 25, gms: 4 },

    // Adicione mais dados conforme necessário
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de itens por página

  // Filtrando os dados com base na busca
  const filteredData = data.filter(item =>
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculando o número total de páginas
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Determinando os itens a serem mostrados na página atual
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Função para ir para a próxima página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='flex flex-col gap-4 h-full'>
      <Input
        type="text"
        placeholder="Filter address"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-1/2"
      />

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead className="text-right">GMs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { currentItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                    <div className="font-medium">{item.id}</div>
                </TableCell>
                <TableCell className="text-left">{item.address}</TableCell>
                <TableCell className="text-left">{item.streak}</TableCell>
                <TableCell className="text-right">{item.gms}</TableCell>
              </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
