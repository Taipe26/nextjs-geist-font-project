"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSubnets, isValidIP, isValidMask, type SubnetResult } from "@/lib/utils";

export default function SubnetCalculator() {
  const [ip, setIp] = useState("12.3.2.5");
  const [mask, setMask] = useState("255.0.0.0");
  const [desiredSubnets, setDesiredSubnets] = useState("5");
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const newErrors: string[] = [];

    if (!isValidIP(ip)) {
      newErrors.push("Dirección IP inválida");
    }

    if (!isValidMask(mask)) {
      newErrors.push("Máscara de subred inválida");
    }

    const subnetsNum = parseInt(desiredSubnets);
    if (isNaN(subnetsNum) || subnetsNum <= 0) {
      newErrors.push("Número de subredes debe ser mayor a 0");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      const calculationResult = calculateSubnets(ip, mask, subnetsNum);
      setResult(calculationResult);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Calculadora de Subredes
          </h1>
          <p className="text-gray-600">
            Herramienta para calcular subredes IP de manera eficiente
          </p>
        </div>

        {/* Input Form */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ip" className="text-sm font-medium text-gray-700">
                  Dirección IP:
                </Label>
                <Input
                  id="ip"
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="192.168.1.1"
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mask" className="text-sm font-medium text-gray-700">
                  Máscara de Subred:
                </Label>
                <Input
                  id="mask"
                  type="text"
                  value={mask}
                  onChange={(e) => setMask(e.target.value)}
                  placeholder="255.255.255.0"
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subnets" className="text-sm font-medium text-gray-700">
                  Número de Subredes Deseadas:
                </Label>
                <Input
                  id="subnets"
                  type="number"
                  value={desiredSubnets}
                  onChange={(e) => setDesiredSubnets(e.target.value)}
                  placeholder="5"
                  min="1"
                  className="h-12 text-lg"
                />
              </div>
            </div>

            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <ul className="text-red-600 text-sm">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center">
              <Button
                onClick={handleCalculate}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transform transition hover:scale-105"
              >
                Calcular Subredes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-center">
                Resultados del Cálculo
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <Card className="border-l-4 border-l-blue-500 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-blue-600 font-semibold">
                      Clase: <span className="text-gray-800">{result.clase}</span>
                    </div>
                    <div className="text-blue-600 font-semibold">
                      Máscara Original: <span className="text-gray-800">{result.mascaraOriginal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="border-l-4 border-l-cyan-500 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-cyan-600 font-semibold">
                      Nro de bits prestados: <span className="text-gray-800">{result.nroBitsPrestados}</span>
                    </div>
                    <div className="text-cyan-600 font-semibold">
                      Nro de subredes: <span className="text-gray-800">{result.nroSubredes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="border-l-4 border-l-teal-500 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-teal-600 font-semibold">
                      Nro de subredes utilizables: <span className="text-gray-800">{result.nroSubredesUtilizables}</span>
                    </div>
                    <div className="text-teal-600 font-semibold">
                      Nro de IPs por sub red: <span className="text-gray-800">{result.nroIPsPorSubRed.toLocaleString()}</span>
                      <sup className="text-xs">1</sup> = <span className="text-gray-800">{result.nroIPsConfigurablesPorSubRed.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="border-l-4 border-l-emerald-500 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-emerald-600 font-semibold">
                      Nro de IPs configurables por sub red: <span className="text-gray-800">{result.nroIPsConfigurablesPorSubRed.toLocaleString()}</span>
                    </div>
                    <div className="text-emerald-600 font-semibold">
                      New máscara: <span className="text-gray-800">{result.newMascara}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-purple-500 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-purple-600 font-semibold">
                      Salto: <span className="text-gray-800">{result.salto}/8={Math.floor(result.salto/8)}</span>
                    </div>
                    <div className="text-purple-600 font-semibold">
                      Subredes Solicitadas: <span className="text-gray-800">{result.subredesSolicitadas}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
