import HeaderDashboard from '@/components/Header/HeaderDasboard';
import FooterDashboard from '@/components/Footer/FooterDasboard';
import RiwayatTransaksiTable from '@/components/RiwayatTransaksiTable/RiwayatTransaksiTable';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import Label from '@/components/Label/Label';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TMutasi, mutasiSchema } from './mutasiSchema';
import { useEffect, useState } from 'react';
import Alert from '@/components/Alert/Alert';
import { useUserStore } from '@/store/UserStore';

export default function Mutasi() {
  const { userData, fetchUserData, fetchMutations, userMutations } =
    useUserStore();

  const [formError, setFormError] = useState<string | null>(null);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [filteredTransactions, setFilteredTransactions] =
    useState(userMutations);

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [fetchUserData, userData]);

  useEffect(() => {
    if (userData && userData.account_number) {
      fetchMutations(userData.account_number);
    }
  }, [userData, fetchMutations]);

  useEffect(() => {
    if (userMutations) {
      setFilteredTransactions(userMutations);
      console.log(userMutations);
    }
  }, [userMutations]);

  const { handleSubmit, control } = useForm<TMutasi>({
    resolver: zodResolver(mutasiSchema),
  });

  const onSubmit = (data: TMutasi) => {
    setFormError(null);
    setHasValidationErrors(false);

    const filteredData = userMutations.filter((transaction: any) => {
      const sampaiTanggal = data.sampaiTanggal
        ? new Date(data.sampaiTanggal)
        : null;
      if (sampaiTanggal) sampaiTanggal.setHours(23, 59, 59, 999);

      const isJenisTransaksiMatch =
        data.jenisTransaksi === 'semua' ||
        transaction.status.toLowerCase() === data.jenisTransaksi;

      const isDariTanggalMatch =
        !data.dariTanggal ||
        new Date(transaction.datetime) >= new Date(data.dariTanggal);

      const isSampaiTanggalMatch =
        !data.sampaiTanggal || new Date(transaction.datetime) <= sampaiTanggal;

      const isPendingInFuture =
        transaction.status.toLowerCase() === 'pending' &&
        new Date(transaction.datetime) > new Date();

      // Check all conditions together
      return (
        isJenisTransaksiMatch &&
        (isPendingInFuture ||
          (data.dariTanggal && data.sampaiTanggal
            ? isDariTanggalMatch && isSampaiTanggalMatch
            : true))
      );
    });

    setFilteredTransactions(filteredData);
  };

  const onError = (errors: FieldValues) => {
    for (const key in errors) {
      if (errors[key]?.message) {
        setFormError(errors[key].message);
        break;
      }
    }
    setHasValidationErrors(true);
  };

  const onClose = () => {
    setHasValidationErrors(false);
  };

  return (
    <>
      <HeaderDashboard />
      <main className="flex-grow w-[min(100%,1056px)] px-6 lg:mx-auto lg:px-0 py-10 mb-20">
        <h1 className="text-4xl font-bold mb-8">Mutasi</h1>

        <div className="w-full h-full bg-neutral-01 p-6 rounded-lg shadow-02 mb-8">
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="w-full">
              <Label htmlFor="jenisTransaksi">Jenis Transaksi</Label>
              <Controller
                name="jenisTransaksi"
                control={control}
                defaultValue="semua"
                render={({ field }) => (
                  <select
                    {...field}
                    id="jenisTransaksi"
                    className="w-full h-[42px] bg-neutral-01 px-5 rounded-lg focus:outline-primary-blue border border-primary-blue appearance-none focus:ring-primary-blue focus:border-primary-blue block"
                    aria-label="Jenis Transaksi"
                  >
                    <option value="semua">Semua</option>
                    <option value="completed">Selesai</option>
                    <option value="pending">Tertunda</option>
                  </select>
                )}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="dariTanggal">Dari Tanggal</Label>
              <Controller
                name="dariTanggal"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dariTanggal"
                    type="date"
                    aria-label="Masukkan dari tanggal mutasi"
                    className="w-full h-[42px] !bg-neutral-01 border-primary-blue !py-2"
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="sampaiTanggal">Sampai Tanggal</Label>
              <Controller
                name="sampaiTanggal"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="sampaiTanggal"
                    type="date"
                    aria-label="Masukkan sampai tanggal mutasi"
                    className="w-full h-[42px] !bg-neutral-01 border-primary-blue !py-2"
                  />
                )}
              />
            </div>
            <div className="w-full flex items-end">
              <Button
                type="submit"
                id="btnMutasi"
                aria-label="Tombol Mutasi"
                className=""
              >
                Cari Mutasi
              </Button>
            </div>
          </form>
        </div>
        <div className="w-full h-full bg-neutral-01 p-6 rounded-lg shadow-02 flex flex-col gap-y-5">
          <RiwayatTransaksiTable
            transactions={filteredTransactions}
            maxRow={5}
            pagination
          />
        </div>
      </main>
      <FooterDashboard />
      <Alert
        isOpen={hasValidationErrors}
        showCloseButton={true}
        autoDismiss={false}
        variant="danger"
        onClose={onClose}
      >
        {formError}
      </Alert>
    </>
  );
}
