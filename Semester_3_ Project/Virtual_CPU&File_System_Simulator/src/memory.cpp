#include "../include/memory.hpp"

Memory::Memory()
{
    clear();
}

uint8_t Memory::read(int address) const
{
    if (address < 0 || address >= SIZE)
    {
        throw std::out_of_range("Memory read out of bounds");
    }
    return mem[address];
}

void Memory::write(int address, uint8_t value)
{
    if (address < 0 || address >= SIZE)
    {
        throw std::out_of_range("Memory write out of bounds");
    }
    mem[address] = value;
}

void Memory::clear()
{
    for (int i = 0; i < SIZE; i++)
    {
        mem[i] = 0;
    }
}