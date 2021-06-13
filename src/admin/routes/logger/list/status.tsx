import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  InternalStatusLogger,
  InternalStatusLoggerRecord,
  InternalLoggerMeta,
} from "@webcarrot/multi-lan-controller/admin/api/logger/types";
import {
  ItemContent,
  Loader,
  useAdminApiCall,
} from "@webcarrot/multi-lan-controller/admin/components";
import * as React from "react";
import {
  CSVLine,
  makeCsvLine,
} from "@webcarrot/multi-lan-controller/common/utils/csv";
import { Footer } from "./footer";

const formatToCsv = (items: ReadonlyArray<InternalStatusLoggerRecord>) =>
  [["date", "name", "place", "status"] as CSVLine]
    .concat(
      items.map<CSVLine>(({ date, name, place, isOnline }) => [
        new Date(date).toISOString(),
        name,
        place,
        isOnline ? "online" : "offline",
      ])
    )
    .map(makeCsvLine)
    .join("\r\n");

export const Status = React.memo(() => {
  const [data, setData] = React.useState<InternalStatusLogger>(null);
  const [query, setQuery] = React.useState<InternalLoggerMeta>({
    limit: 50,
    offset: 0,
    total: null,
  });

  const adminApi = useAdminApiCall();

  const handleExport = React.useCallback(
    (query: InternalLoggerMeta) =>
      adminApi("Logger/List", {
        type: "status",
        limit: 100000000,
        offset: 0,
        fromDate: query.fromDate,
        toDate: query.toDate,
      }).then(({ items }: InternalStatusLogger) => formatToCsv(items)),
    [adminApi]
  );

  React.useEffect(() => {
    let handleData = setData;
    adminApi("Logger/List", {
      type: "status",
      limit: query.limit,
      offset: query.offset,
      fromDate: query.fromDate,
      toDate: query.toDate,
    }).then((data: InternalStatusLogger) => handleData(data));
    return () => {
      handleData = () => {};
    };
  }, [query, adminApi]);

  return data ? (
    <>
      <ItemContent>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Place</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map(({ date, name, place, isOnline }, key) => (
                <TableRow
                  style={isOnline ? {} : { background: "rgba(255,64,0,0.5)" }}
                  key={`${key}-${date}`}
                >
                  <TableCell align="left">
                    {new Date(date).toLocaleString()}
                  </TableCell>
                  <TableCell align="left">{name}</TableCell>
                  <TableCell align="left">{place}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ItemContent>
      <Footer meta={data.meta} onChange={setQuery} onExport={handleExport} />
    </>
  ) : (
    <Loader />
  );
});
