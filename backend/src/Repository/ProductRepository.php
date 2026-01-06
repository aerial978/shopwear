<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * Catalogue public (MVP) : produits actifs uniquement, pagination + recherche + tri + filtre catégorie (slug).
     *
     * @return array{items: Product[], total: int}
     */
    public function findPaginatedForCatalogue(
        int $page = 1,
        int $limit = 12,
        ?string $q = null,
        ?string $categorySlug = null,
        string $sort = 'createdAt',
        string $order = 'desc'
    ): array {
        // Garde-fous
        $page  = max(1, $page);
        $limit = max(1, min(100, $limit));

        // Whitelist sort + order
        $sortMap = [
            'createdAt'  => 'p.createdAt',
            'priceCents' => 'p.priceCents',
        ];
        $sortField = $sortMap[$sort] ?? $sortMap['createdAt'];
        $orderSql  = strtolower($order) === 'asc' ? 'ASC' : 'DESC';

        // Normalisation q
        $q = $q !== null ? trim($q) : null;
        if ($q === '') {
            $q = null;
        }

        // Normalisation categorySlug
        $categorySlug = $categorySlug !== null ? trim($categorySlug) : null;
        if ($categorySlug === '') {
            $categorySlug = null;
        }

        // Base query (filtres partagés items + count)
        $qb = $this->createQueryBuilder('p')
            ->andWhere('p.isActive = :active')
            ->setParameter('active', true);

        if ($q !== null) {
            $qb
                ->andWhere('p.name LIKE :q OR p.slug LIKE :q')
                ->setParameter('q', '%' . $q . '%');
        }

        if ($categorySlug !== null) {
            $qb
                ->innerJoin('p.category', 'c')
                ->andWhere('c.slug = :categorySlug')
                // Option "propre" : filtrer aussi les catégories actives
                ->andWhere('c.isActive = :catActive')
                ->setParameter('catActive', true)
                ->setParameter('categorySlug', $categorySlug);
        }

        $offset = ($page - 1) * $limit;

        // Items
        $items = (clone $qb)
            ->orderBy($sortField, $orderSql)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        // Count
        $total = (int) (clone $qb)
            ->select('COUNT(p.id)')
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'items' => $items,
            'total' => $total,
        ];
    }
}
