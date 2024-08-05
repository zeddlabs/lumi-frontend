import bgAuth from "@/assets/bg-auth.jpg";
import Button from "@/components/Button/Button";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import { IFormInput } from "./types";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "@/store/RegisterStore";
import { useLoading } from "@/hooks/useLoading";
import SpinnerWrapper from "@/components/Spinner/SpinnerWrapper";

const DataDiri = () => {
  const { no_ktp, name, date_of_birth } = useRegistrationStore(
    (state) => state
  );
  const setField = useRegistrationStore((state) => state.setField);
  const navigate = useNavigate();
  const { isLoading, withLoading } = useLoading();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      noKtp: no_ktp || "",
      nama: name || "",
      tanggalLahir: date_of_birth.split("-").reverse().join("-") || "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setField("no_ktp", data.noKtp);
    setField("name", data.nama);
    setField("date_of_birth", data.tanggalLahir.split("-").reverse().join("-"));

    withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/register/ktp");
    });
  };

  return (
    <>
      <SpinnerWrapper isLoading={isLoading}>
        <Header />
        <main
          className="w-full min-h-[828px] h-[calc(100vh-73px-75px)] md:h-[calc(100vh-94px-75px)] bg-cover bg-center"
          style={{ backgroundImage: `url(${bgAuth})` }}
        >
          <div className="container mx-auto px-6 flex items-center justify-center md:justify-end h-full">
            <div className="bg-neutral-01 px-8 py-14 md:px-14 rounded-lg w-[450px]">
              <h1 className="mb-10 text-3xl text-primary-blue font-bold">
                Data Diri
              </h1>
              <form
                className="flex flex-col gap-y-8"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-y-3">
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="noKtp">No KTP</Label>
                      {errors.noKtp && (
                        <span className="text-secondary-red flex items-center">
                          <MaterialSymbol icon="error" title="error" />
                        </span>
                      )}
                    </div>
                    <div>
                      <Controller
                        name="noKtp"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="noKtp"
                            type="text"
                            placeholder="1234567891011"
                            aria-label="Masukkan no KTP Anda"
                            className={`${
                              errors.noKtp
                                ? "border-2 border-secondary-red focus:outline-secondary-red"
                                : ""
                            }`}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/[^0-9]/g, "")
                              )
                            }
                          />
                        )}
                        rules={{
                          required: "Input no KTP tidak boleh kosong",
                          pattern: {
                            value: /^\d{16}$/,
                            message: "No KTP harus terdiri dari 16 angka",
                          },
                        }}
                      />
                      {errors.noKtp && (
                        <p className="text-secondary-red">
                          {errors.noKtp.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="nama">Nama</Label>
                      {errors.nama && (
                        <span className="text-secondary-red flex items-center">
                          <MaterialSymbol icon="error" title="error" />
                        </span>
                      )}
                    </div>
                    <div>
                      <Controller
                        name="nama"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="nama"
                            type="text"
                            placeholder="John Doe"
                            aria-label="Masukkan nama Anda"
                            className={
                              errors.nama
                                ? "border-2 border-secondary-red focus:outline-secondary-red"
                                : ""
                            }
                            {...field}
                          />
                        )}
                        rules={{
                          required: "Input nama tidak boleh kosong",
                        }}
                      />
                      {errors.nama && (
                        <p className="text-secondary-red">
                          {errors.nama.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                      {errors.tanggalLahir && (
                        <span className="text-secondary-red flex items-center">
                          <MaterialSymbol icon="error" title="error" />
                        </span>
                      )}
                    </div>
                    <div>
                      <Controller
                        name="tanggalLahir"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="tanggalLahir"
                            type="date"
                            aria-label="Masukkan tanggal lahir Anda"
                            className={
                              errors.tanggalLahir
                                ? "border-2 border-secondary-red focus:outline-secondary-red"
                                : ""
                            }
                            {...field}
                            max={`${new Date().toLocaleDateString("en-ca")}`}
                          />
                        )}
                        rules={{
                          required: "Input tanggal lahir tidak boleh kosong",
                        }}
                      />
                      {errors.tanggalLahir && (
                        <p className="text-secondary-red">
                          {errors.tanggalLahir.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2 items-center">
                  <Button id="btnLanjut" aria-label="Tombol masuk">
                    Lanjut
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </SpinnerWrapper>
    </>
  );
};

export default DataDiri;
