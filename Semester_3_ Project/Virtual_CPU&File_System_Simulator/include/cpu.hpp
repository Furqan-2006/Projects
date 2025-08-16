#pragma once

#include <cstdint>
#include <iostream>

class CPU
{
public:
    uint32_t registers[4];
    uint16_t pc;
    bool zeroFlag;

    CPU();

    void reset();
    void printState() const;
};
