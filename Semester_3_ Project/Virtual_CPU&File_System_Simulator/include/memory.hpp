#pragma once

#include <cstdint>
#include <stdexcept>

class Memory
{
private:
    static const int SIZE = 4096;
    uint8_t mem[SIZE];

public:
    Memory();

    uint8_t read(int address) const;
    void write(int address, uint8_t value);
    void clear();
};